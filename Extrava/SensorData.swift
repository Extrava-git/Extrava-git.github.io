import Foundation

struct SensorValue: Identifiable {
    let id = UUID()
    let timestamp: Date
    let value: Double
}

struct Sensor: Identifiable {
    let id: String
    let name: String
    let unit: String
    var value: Double
    var history: [SensorValue] = []
    let weight: Double
}
