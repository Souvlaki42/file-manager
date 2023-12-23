// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use winapi::um::winnt::FILE_ATTRIBUTE_HIDDEN;
use std::{fs, path::{Path, PathBuf}, os::windows::fs::MetadataExt, time::UNIX_EPOCH, process::Command};
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
    path: String,
    kind: DriveItemKind,
    hidden: bool,
    size: u64,
    created: u128,
    modified: u128
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

#[derive(Debug, serde::Serialize)]
struct FolderPaths {
    desktop: String,
    downloads: String,
    documents: String,
    pictures: String,
    music: String,
    videos: String,
}

#[tauri::command]
fn open_file(file_path: String, open_with: bool) -> Result<(), String> {
    match Command::new("cmd")
        .args(&["/C", "start", if open_with {"openwith"} else {""}, file_path.as_str()])
        .status()
    {
        Ok(status) => {
            if status.success() {
                Ok(())
            } else {
                Err(format!("Failed to open 'Open With' window for file: {}", file_path))
            }
        }
        Err(e) => Err(format!("Error executing command: {}", e)),
    }
}

#[tauri::command]
fn get_folder_paths() -> FolderPaths {
    let mut folder_paths = FolderPaths {
        desktop: String::new(),
        downloads: String::new(),
        documents: String::new(),
        pictures: String::new(),
        music: String::new(),
        videos: String::new(),
    };

    if cfg!(windows) {
        folder_paths.desktop = PathBuf::from(format!(
            "{}\\Desktop",
            std::env::var("USERPROFILE").unwrap()
        )).as_path().to_string_lossy().to_string();
        folder_paths.downloads = PathBuf::from(format!(
            "{}\\Downloads",
            std::env::var("USERPROFILE").unwrap()
        )).as_path().to_string_lossy().to_string();
        folder_paths.documents = PathBuf::from(format!(
            "{}\\Documents",
            std::env::var("USERPROFILE").unwrap()
        )).as_path().to_string_lossy().to_string();
        folder_paths.pictures = PathBuf::from(format!(
            "{}\\Pictures",
            std::env::var("USERPROFILE").unwrap()
        )).as_path().to_string_lossy().to_string();
        folder_paths.music = PathBuf::from(format!(
            "{}\\Music",
            std::env::var("USERPROFILE").unwrap()
        )).as_path().to_string_lossy().to_string();
        folder_paths.videos = PathBuf::from(format!(
            "{}\\Videos",
            std::env::var("USERPROFILE").unwrap()
        )).as_path().to_string_lossy().to_string();
    } else {
        folder_paths.desktop = PathBuf::from(format!(
            "{}/Desktop",
            std::env::var("HOME").unwrap()
        )).as_path().to_string_lossy().to_string();
        folder_paths.downloads = PathBuf::from(format!(
            "{}/Downloads",
            std::env::var("HOME").unwrap()
        )).as_path().to_string_lossy().to_string();
        folder_paths.documents = PathBuf::from(format!(
            "{}/Documents",
            std::env::var("HOME").unwrap()
        )).as_path().to_string_lossy().to_string();
        folder_paths.pictures = PathBuf::from(format!(
            "{}/Pictures",
            std::env::var("HOME").unwrap()
        )).as_path().to_string_lossy().to_string();
        folder_paths.music = PathBuf::from(format!(
            "{}/Music",
            std::env::var("HOME").unwrap()
        )).as_path().to_string_lossy().to_string();
        folder_paths.videos = PathBuf::from(format!(
            "{}/Videos",
            std::env::var("HOME").unwrap()
        )).as_path().to_string_lossy().to_string();
    }

    return folder_paths;
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
    let mut drive_files: Vec<DriveItem> = Vec::new();
    match fs::read_dir(&path) {
        Ok(files) => {
            for file in files {
                match file {
                    Ok(entry) => {
                        let path_buf = entry.path().to_path_buf();
                        let metadata = entry.metadata().unwrap();
                        
                        let name = entry.file_name().to_string_lossy().to_string();
                        let path = entry.path().to_string_lossy().to_string();
                        let kind = if path_buf.is_dir() { DriveItemKind::Directory } else { DriveItemKind::File };
                        let hidden = is_hidden(path_buf.as_path());

                        let size = metadata.len();
                        let created = metadata.created().unwrap().duration_since(UNIX_EPOCH).unwrap().as_millis();
                        let modified = metadata.modified().unwrap().duration_since(UNIX_EPOCH).unwrap().as_millis();

                        drive_files.push(DriveItem { name, path, kind, hidden, size, created, modified });
                    },
                    Err(_) => {
                        continue;
                    }
                }
            }

            return drive_files;
        },
        Err(error) => {
            eprintln!("Error reading directory: {:?}", error);
            return Vec::new();
        }
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_volumes, get_contents, get_folder_paths, open_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
