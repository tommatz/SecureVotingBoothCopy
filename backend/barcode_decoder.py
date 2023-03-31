#Written by Gerry Pasquale, using DocBarcodes library from https://github.com/ArlindNocaj/document-barcodes
import zxing
def decode(image) :
    try:
        reader = zxing.BarCodeReader()
        
        barcode = reader.decode(image) #index 2 is the data, index 3 is the format (possible_formats = ["PDF_417", "CODE_128", "QR_CODE", "AZTEC"])

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


        
        data = barcode.parsed
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