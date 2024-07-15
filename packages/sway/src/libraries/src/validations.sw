library;

use std::{ 
    string::String,
    bytes::Bytes,
};

enum NameValidationError {
    InvalidLenght: (),
    InvalidChars: (),
    IsEmpty: (),
}

//// @ in bytes
const NAME_PREFIX: u8 = 64;
const NAME_MIN_LEN: u64 = 2;
const NAME_MAX_LEN: u64 = 31;

pub const ASCII_HANDLE_VALID_CHARS: [u8; 37] = [
    // 0-9 in bytes
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57,

    // A-Z in bytes
    // 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 
    // 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 
    // 85, 86, 87, 88, 89, 90,

    // "_" in chars
    95,

    // a-z in bytes
    97, 98, 99, 100, 101, 102, 103, 104, 105, 
    106, 107, 108, 109, 110, 111, 112, 113, 114,
    115, 116, 117, 118, 119, 120, 121, 122,
];

fn is_valid_ascii_letter(value: u8) -> bool {
    let ascii_arr_size = 37;
    let mut count: u64 = 0;

    while count < ascii_arr_size + 1 {
        if (ASCII_HANDLE_VALID_CHARS[count] == value) {
            return true
        }

        count = count + 1;
    }

    return false;
}

fn name_as_bytes(name: String) -> Bytes {
    let mut bytes = name.as_bytes();

    let mut has_at = bytes.get(0).unwrap() == NAME_PREFIX;

    if (!has_at) {
        return bytes;
    };

    let mut _bytes = Bytes::new();
    let mut index = 0;

    while index < bytes.len() - 1 {
        _bytes.push(bytes.get(index + 1).unwrap());
        index+=1;
    }

    return _bytes;
}

pub fn assert_name_validity(name: String) -> String {
    let mut bytes = name_as_bytes(name);
    let mut name_length = bytes.len();

    require(name_length > 0, NameValidationError::IsEmpty);
    require(
        name_length > NAME_MIN_LEN && name_length < NAME_MAX_LEN, 
        NameValidationError::InvalidLenght
    );

    while name_length != 0 {
        let letter_bytes = bytes.get(name_length - 1).unwrap();
        if (!is_valid_ascii_letter(letter_bytes)) {
            require(false, NameValidationError::InvalidChars);
        }
        name_length = name_length - 1;
    }

    return String::from(bytes);
}

#[test]
fn test_name_as_bytes() {
    use std::assert::assert;

    let name = String::from_ascii_str("test");
    let name_with_at = String::from_ascii_str("@test");

    let name_bytes = name_as_bytes(name);
    let name_with_at_bytes = name_as_bytes(name_with_at);

    assert(name_bytes == name.as_bytes());  
    assert(name_bytes.len() == name.as_bytes().len());
    
    assert(name_with_at_bytes == name.as_bytes());
    assert(name_with_at_bytes.len() == name.as_bytes().len());
}

#[test]
fn test_valid_ascii() {
    use std::assert::assert;

    // Valid chars
    assert(is_valid_ascii_letter(48));
    assert(is_valid_ascii_letter(95));

    // Invalid chars
    assert(!is_valid_ascii_letter(200));
    assert(!is_valid_ascii_letter(209));
}

#[test]
fn test_valid_name_ascii() {
    use std::assert::assert;

    let name = String::from_ascii_str("teste123");
    let name_with_at = String::from_ascii_str("@teste123");

    let validated_name = assert_name_validity(name_with_at);

    assert(validated_name == name);
}

#[test(should_revert)]
fn test_invalid_name_lowercase() {
    use std::assert::assert;

    let invalid_name = String::from_ascii_str("@TESTE");
    let _ = assert_name_validity(invalid_name);
}

#[test(should_revert)]
fn test_invalid_name_ascii() {
    use std::assert::assert;

    let invalid_name = String::from_ascii_str("@asd___#$%#$%");
    let _ = assert_name_validity(invalid_name);
}

#[test(should_revert)]
fn test_invalid_length() {
    use std::assert::assert;

    let valid_name = String::from_ascii_str("@asdfb1234567890mnopqrstuvxwyz1");
    let _ = assert_name_validity(valid_name);

    let invalid_name = String::from_ascii_str("@asdfb1234567890mnopqrstuvxwyz12");
    let _ = assert_name_validity(invalid_name);
}