library;

use std::{ string::String };

pub struct MetadataRegisteredEvent {
    /// b256 of metadata
    pub metadata_id: b256,

    /// the key string of metadata
    pub metadata_key: String,

    /// the value string of metadata
    pub metadata_value: String,
}