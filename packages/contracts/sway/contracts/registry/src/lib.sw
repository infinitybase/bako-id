library;

use std::string::String;

pub fn domain_price(domain: String, period: u16) -> u64 {
    let domain_len = domain.as_bytes().len();
    let mut amount = match domain_len {
        3 => 5_000,
        4 => 1_000,
        _ => 200,
    };
    amount = amount * 1000;
    return amount * period.as_u64();
}