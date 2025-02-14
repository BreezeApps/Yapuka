// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri_plugin_sql::{Migration, MigrationKind};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default()
            .add_migrations("sqlite:tasks.db", vec![
                Migration {
                    version: 1,
                    description: "initial schema",
                    sql: include_str!("./migrations/migration.sql"),
                    kind: MigrationKind::Up,
                }
            ])
            .build()
        )
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
    yapuka_lib::run()
}
