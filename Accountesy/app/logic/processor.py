def map_ledger(description, ledger_list, ai_memory):

    for ledger in ledger_list:
        if ledger.lower() in description.lower():
            return ledger

    for item in ai_memory:
        if item["pattern"] in description.lower():
            return item["ledger"]

    return "Suspense"
