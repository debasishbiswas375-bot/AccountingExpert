from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
from app.tools.mapper import smart_map_bank
import pandas as pd
import uuid, os

router = APIRouter()

TEMP_DIR = "app/temp"
os.makedirs(TEMP_DIR, exist_ok=True)


@router.post("/convert-excel")
async def convert_excel(file: UploadFile = File(...)):
    content = await file.read()

    df = smart_map_bank(content, file.filename)

    output_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}.xlsx")

    if "raw_text" in df.columns:
        with pd.ExcelWriter(output_path) as writer:
            df.to_excel(writer, sheet_name="Raw Transactions", index=False)
    else:
        summary_df = pd.DataFrame({
            "Metric": ["Total Transactions", "Total Credit", "Total Debit"],
            "Value": [len(df), df["credit"].sum(), df["debit"].sum()]
        })

        with pd.ExcelWriter(output_path) as writer:
            df.to_excel(writer, sheet_name="Raw Transactions", index=False)
            df.to_excel(writer, sheet_name="Processed Transactions", index=False)
            summary_df.to_excel(writer, sheet_name="Summary", index=False)

    return FileResponse(output_path, filename="converted.xlsx")
