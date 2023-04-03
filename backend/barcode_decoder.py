#Written by Gerry Pasquale, using DocBarcodes library from https://github.com/ArlindNocaj/document-barcodes
from docbarcodes.extract import process_document #pip install docbarcodes

def decode(image) :
    try:
        barcodes = process_document(image) #index 2 is the data, index 3 is the format (possible_formats = ["PDF_417", "CODE_128", "QR_CODE", "AZTEC"])

        info = {
                "username" : {
                    "first": "DAC",
                    "middle": "DAD",
                    "last": "DCS",
                    "suffix": "DCU"
                },
                "address" : {
                    "country_code": "US",
                    "country_area": "DAJ",
                    "city": "DAI",
                    "postal_code": "DAK",
                    "street_address": "DAG"
                }
        }

        selected = []
        count = 0

        for barcode in barcodes[0] : #Index 0 is the raw barcode
            if len(barcode) >= 3 and barcode[3] == "PDF_417" :
                count += 1
                selected = barcode

        if count > 1 :
            return [False, "Multiple barcodes were found in this image."]
        elif count == 0 :
            return [False, "No barcodes were found in this image."]
        
        data = selected[2]
        mid = False
        suf = False
        count = 0

        for line in data.split('\n') :
            if len(line) <= 3:
                continue
            
            for type in info :
                for field in info[type] :
                    if line[:3] == info[type][field] :
                        count += 1
                        info[type][field] = line[3:]
                        if field == "middle" :
                            mid = True
                        if field == "suffix" :
                            suf = True   
        
        
        if count < 2 :
            return [False, "Invalid Barcode"]

        if mid == False :
            info["username"]["middle"] = ""

        if suf == False :
            info["username"]["suffix"] = ""

        return [True, info]
            
            
    except:
        return [False, "Failed to decode image."]




if __name__ == '__main__':
    import os
    path = "./data/barcodes"
    files = os.listdir(path)
    
    for file in files :
        print("-----", (file).split(".")[0], "-----")
        ret = decode(path + '/' + file)
        print("Success:", ret[0])
        print("Message:", ret[1], '\n')