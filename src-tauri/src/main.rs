// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    fs,
    io::ErrorKind,
    path::{Path, PathBuf},
    process::Command,
    time::UNIX_EPOCH,
};
use sysinfo::{Disks, System};

#[derive(Debug, serde::Serialize)]
struct Drive {
    name: String,
    letter: char,
    total: u64,
    available: u64,
}

#[derive(Debug, serde::Serialize, PartialEq, Clone, Copy)]
enum DriveItemKind {
    Directory,
    File,
}

#[derive(Debug, serde::Serialize, PartialEq)]
struct DriveItem {
    name: String,
    path: String,
    kind: DriveItemKind,
    hidden: bool,
    size: u64,
    created: u128,
    modified: u128,
}

fn is_hidden(path: &Path) -> bool {
    path.file_name()
        .and_then(|name| name.to_str())
        .map(|name| name.starts_with('.'))
        .unwrap_or(false)
}

#[derive(Debug, serde::Serialize)]
struct FolderPaths {
    trash: String,
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
        .args(&[
            "/C",
            "start",
            if open_with { "openwith" } else { "" },
            file_path.as_str(),
        ])
        .status()
    {
        Ok(status) => {
            if status.success() {
                Ok(())
            } else {
                Err(format!(
                    "Failed to open {}for file: {}",
                    if open_with { "'Open With' window " } else { "" },
                    file_path
                ))
            }
        }
        Err(e) => Err(format!("Error executing command: {}", e)),
    }
}

#[tauri::command]
fn create_file(file_path: String) -> Result<(), String> {
    match Command::new("cmd")
        .args(&["/C", "touch", file_path.as_str()])
        .status()
    {
        Ok(status) => {
            if status.success() {
                Ok(())
            } else {
                Err(format!("Failed to create the file: {}", file_path))
            }
        }
        Err(e) => Err(format!("Error executing command: {}", e)),
    }
}

#[tauri::command]
fn create_folder(folder_path: String) -> Result<(), String> {
    match Command::new("cmd")
        .args(&["/C", "mkdir", folder_path.as_str()])
        .status()
    {
        Ok(status) => {
            if status.success() {
                Ok(())
            } else {
                Err(format!("Failed to create the folder: {}", folder_path))
            }
        }
        Err(e) => Err(format!("Error executing command: {}", e)),
    }
}

#[tauri::command]
fn delete_file(file_path: String) -> Result<(), String> {
    match Command::new("cmd")
        .args(&["/C", "del", "/f", file_path.as_str()])
        .status()
    {
        Ok(status) => {
            if status.success() {
                Ok(())
            } else {
                Err(format!("Failed to delete the file: {}", file_path))
            }
        }
        Err(e) => Err(format!("Error executing command: {}", e)),
    }
}

#[tauri::command]
fn delete_folder(folder_path: String) -> Result<(), String> {
    match Command::new("cmd")
        .args(&["/C", "rmdir", "/s", "/q", folder_path.as_str()])
        .status()
    {
        Ok(status) => {
            if status.success() {
                Ok(())
            } else {
                Err(format!("Failed to delete the folder: {}", folder_path))
            }
        }
        Err(e) => Err(format!("Error executing command: {}", e)),
    }
}

#[tauri::command]
fn rename_item(old_path: String, new_name: String) -> Result<(), String> {
    match Command::new("cmd")
        .args(&["/C", "ren", &old_path, &new_name])
        .status()
    {
        Ok(status) => {
            if status.success() {
                Ok(())
            } else {
                Err(format!(
                    "Failed to rename the item: {} to {}",
                    old_path, new_name
                ))
            }
        }
        Err(e) => Err(format!("Error executing command: {}", e)),
    }
}

#[tauri::command]
fn get_folder_paths() -> FolderPaths {
    let mut folder_paths = FolderPaths {
        trash: String::new(),
        desktop: String::new(),
        downloads: String::new(),
        documents: String::new(),
        pictures: String::new(),
        music: String::new(),
        videos: String::new(),
    };

    if cfg!(windows) {
        folder_paths.trash = PathBuf::from("C:\\$Recycle.Bin")
            .as_path()
            .to_string_lossy()
            .to_string();
        folder_paths.desktop = PathBuf::from(format!(
            "{}\\Desktop",
            std::env::var("USERPROFILE").unwrap()
        ))
        .as_path()
        .to_string_lossy()
        .to_string();
        folder_paths.downloads = PathBuf::from(format!(
            "{}\\Downloads",
            std::env::var("USERPROFILE").unwrap()
        ))
        .as_path()
        .to_string_lossy()
        .to_string();
        folder_paths.documents = PathBuf::from(format!(
            "{}\\Documents",
            std::env::var("USERPROFILE").unwrap()
        ))
        .as_path()
        .to_string_lossy()
        .to_string();
        folder_paths.pictures = PathBuf::from(format!(
            "{}\\Pictures",
            std::env::var("USERPROFILE").unwrap()
        ))
        .as_path()
        .to_string_lossy()
        .to_string();
        folder_paths.music =
            PathBuf::from(format!("{}\\Music", std::env::var("USERPROFILE").unwrap()))
                .as_path()
                .to_string_lossy()
                .to_string();
        folder_paths.videos =
            PathBuf::from(format!("{}\\Videos", std::env::var("USERPROFILE").unwrap()))
                .as_path()
                .to_string_lossy()
                .to_string();
    } else {
        folder_paths.trash = PathBuf::from("~/.local/share/Trash/files")
            .as_path()
            .to_string_lossy()
            .to_string();
        folder_paths.desktop = PathBuf::from(format!("{}/Desktop", std::env::var("HOME").unwrap()))
            .as_path()
            .to_string_lossy()
            .to_string();
        folder_paths.downloads =
            PathBuf::from(format!("{}/Downloads", std::env::var("HOME").unwrap()))
                .as_path()
                .to_string_lossy()
                .to_string();
        folder_paths.documents =
            PathBuf::from(format!("{}/Documents", std::env::var("HOME").unwrap()))
                .as_path()
                .to_string_lossy()
                .to_string();
        folder_paths.pictures =
            PathBuf::from(format!("{}/Pictures", std::env::var("HOME").unwrap()))
                .as_path()
                .to_string_lossy()
                .to_string();
        folder_paths.music = PathBuf::from(format!("{}/Music", std::env::var("HOME").unwrap()))
            .as_path()
            .to_string_lossy()
            .to_string();
        folder_paths.videos = PathBuf::from(format!("{}/Videos", std::env::var("HOME").unwrap()))
            .as_path()
            .to_string_lossy()
            .to_string();
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
        let name = if raw_name.is_empty() {
            "Local Disk".to_string()
        } else {
            raw_name
        };
        let letter = disk
            .mount_point()
            .to_string_lossy()
            .to_string()
            .replace(":\\", "")
            .chars()
            .next()
            .unwrap();
        let total = disk.total_space();
        let available = disk.available_space();

        drives.push(Drive {
            name,
            letter,
            total,
            available,
        });
    }

    return drives;
}

#[tauri::command]
fn get_contents(directory_path: String, recursive: bool) -> Vec<DriveItem> {
    let mut drive_contents: Vec<DriveItem> = Vec::new();
    let mut stack: Vec<String> = Vec::new();

    stack.push(directory_path.clone());

    while let Some(current_path) = stack.pop() {
        match fs::read_dir(&current_path) {
            Ok(files) => {
                for file in files {
                    match file {
                        Ok(entry) => {
                            let path_buf = entry.path().to_path_buf();
                            let metadata = entry.metadata().unwrap();

                            let name = entry.file_name().to_string_lossy().to_string();
                            let path = entry.path().to_string_lossy().to_string();
                            let kind = if path_buf.is_dir() {
                                DriveItemKind::Directory
                            } else {
                                DriveItemKind::File
                            };
                            let hidden = is_hidden(path_buf.as_path());

                            let size = metadata.len();
                            let created = metadata
                                .created()
                                .unwrap()
                                .duration_since(UNIX_EPOCH)
                                .unwrap()
                                .as_millis();
                            let modified = metadata
                                .modified()
                                .unwrap()
                                .duration_since(UNIX_EPOCH)
                                .unwrap()
                                .as_millis();

                            drive_contents.push(DriveItem {
                                name,
                                path: path.clone(),
                                kind,
                                hidden,
                                size,
                                created,
                                modified,
                            });

                            if recursive && kind == DriveItemKind::Directory {
                                stack.push(path);
                            }
                        }
                        Err(_) => {
                            continue;
                        }
                    }
                }
            }
            Err(error) => {
                match error.kind() {
                    ErrorKind::PermissionDenied => {
                        eprintln!("Permission denied on directory: {}", &directory_path)
                    }
                    _ => {
                        eprintln!("Error reading directory: {:?}", error);
                    }
                }
                return Vec::new();
            }
        }
    }

    drive_contents
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_volumes,
            get_contents,
            get_folder_paths,
            open_file,
            create_file,
            create_folder,
            delete_file,
            delete_folder,
            rename_item
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
