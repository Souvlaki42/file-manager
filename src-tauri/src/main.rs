// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use winapi::um::winnt::FILE_ATTRIBUTE_HIDDEN;
use std::{fs, path::{PathBuf, Path}, os::windows::fs::MetadataExt};
use sysinfo::{System, Disks};

#[derive(Debug, serde::Serialize)]
struct Drive {
    name: String,
    letter: char,
    total_capacity: u64,
    available_capacity: u64,
}

#[derive(Debug, serde::Serialize)]
enum DriveItemKind {
    Directory,
    File
}

#[derive(Debug, serde::Serialize)]
struct DriveItem {
    name: String,
    path: PathBuf,
    kind: DriveItemKind,
    hidden: bool,
}

fn is_hidden(path: &Path) -> bool {
    #[cfg(unix)]
    {
        path.file_name()
            .and_then(|name| name.to_str())
            .map(|name| name.starts_with('.'))
            .unwrap_or(false)
    }

    #[cfg(windows)]
    {

        let metadata = path.metadata().unwrap();
        let attributes = metadata.file_attributes();
        attributes & FILE_ATTRIBUTE_HIDDEN != 0
    }
}

#[tauri::command]
fn get_volumes() -> Vec<Drive> {
    let mut system = System::new_all();
    system.refresh_all();

    let mut drives: Vec<Drive> = Vec::new();
    let disks = Disks::new_with_refreshed_list();

    for disk in disks.list() {
        let raw_name = disk.name().to_string_lossy().trim().to_string();
        let name = if raw_name.is_empty() { "Local Disk".to_string() } else { raw_name };
        let letter = disk.mount_point().to_string_lossy().to_string().replace(":\\", "").chars().next().unwrap();
        let total_capacity = disk.total_space();
        let available_capacity = disk.available_space();

        drives.push(Drive { name, letter, total_capacity, available_capacity });
    }

    return drives;
}

#[tauri::command]
fn get_contents(path: String) -> Vec<DriveItem> {
    let mut files: Vec<DriveItem> = Vec::new();
    for file in fs::read_dir(path).unwrap() {
        let file = file.unwrap();
        let name = file.file_name().to_string_lossy().to_string();
        let path = file.path().to_path_buf();
        let kind = if path.is_dir() { DriveItemKind::Directory } else { DriveItemKind::File };
        let hidden = is_hidden(path.as_path());
        files.push(DriveItem { name, path, kind, hidden });
    }

    return files;
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_volumes, get_contents])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
