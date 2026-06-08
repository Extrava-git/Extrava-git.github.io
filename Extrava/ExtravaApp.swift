//
//  ExtravaApp.swift
//  Extrava
//
//  Created by Bhavesh Adivi on 5/25/26.
//

import SwiftUI

@main
struct ExtravaApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .frame(minWidth: 900, minHeight: 700)
        }
        .windowResizability(.contentMinSize)
    }
}
