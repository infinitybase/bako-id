library;

use std::{ 
    string::String,
    bytes::Bytes,
};

pub fn concat_string(string1: String, string2: String) -> String {
    let mut new_string = Bytes::new();
    new_string.append(string1.as_bytes());
    new_string.append(string2.as_bytes());
    
    return String::from(new_string);
}

#[test]
fn test_concat_string() {
    let string1 = String::from_ascii_str("Hello");
    let string2 = String::from_ascii_str("World");
    let result = concat_string(string1, string2);

    let full_string = String::from_ascii_str("HelloWorld");
    assert_eq(result, full_string);
}