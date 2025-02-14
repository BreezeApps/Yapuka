// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::fs;
use std::path::Path;
use std::path::PathBuf;
use serde::{Serialize, Deserialize};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello Test, {}! You've been greeted from Rust!", name)
}