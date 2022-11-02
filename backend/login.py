from i18naddress import InvalidAddress, normalize_address 


def validate_address(input): 
    #This function validates an address against Google's database

    address = False
    try:
        address = normalize_address(input)
    except InvalidAddress as e:
        print(e.errors)

    return address



def validate_name(first, middle, last, suffix):
    # This function validates a name by the following rules
    # The First and Last name must only contain letters or
    # the approved special characters listed

    valid_spc_chars = ["'", "-", ",", "."]
    full_name = first + middle + last + suffix
    for i, v in enumerate(full_name):
        if (not v.isalpha()) and (not v in valid_spc_chars):
            print(v)
            return False #invalid character in the name

    return (first + " " + middle + " " + last + " " + suffix)



def login_request(address_input, first_input, middle_input, last_input, suffix_input):
    parsed_address = validate_address(address_input)
    full_name = validate_name(first_input, middle_input, last_input, suffix_input)

    if not parsed_address:
        print("Address malformed")
        #Send expection back to frontend
        return
    
    if not full_name:
        print("Name malformed")
        #Send expection back to frontend
        return
    
    print("Success Fully Logged In")
    print(full_name)
    print(parsed_address["city"]) 
    # Send success back to frontend to move to next page


test_addy =  {
    'country_code': 'US',
    'country_area': 'California',
    'city': 'Mountain View',
    'postal_code': '94043',
    'street_address': '1600 Amphitheatre Pkwy'
}

login_request(test_addy, "Tom", "Ray", "Matz", "III")