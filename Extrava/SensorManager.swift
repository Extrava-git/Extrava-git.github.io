import Foundation
import Combine

class SensorManager: ObservableObject {
    @Published var sensors: [Sensor] = [
        Sensor(id: "temp", name: "Patch Temperature", unit: "°C", value: 36.6, weight: 0.6),
        Sensor(id: "pressure", name: "Site Swelling/Pressure", unit: "mmHg", value: 12.0, weight: 0.4)
    ]
    
    @Published var riskScore: Double = 0.0
    @Published var status: String = "Normal"
    @Published var isBaselineEstablished: Bool = false
    @Published var baselineTemp: Double = 36.6
    @Published var baselinePressure: Double = 12.0
    
    private var timer: AnyCancellable?
    private var startTime = Date()
    private let baselineDuration: TimeInterval = 30 // 30 seconds for simulation (real would be 10-15 mins)

    init() {
        startSimulation()
    }

    func calculateRisk() {
        guard isBaselineEstablished else {
            riskScore = 0
            status = "Establishing Baseline..."
            return
        }
        
        var totalRisk = 0.0
        
        for sensor in sensors {
            let deviation: Double
            if sensor.id == "temp" {
                // Inflammation (rise) or Cool leakage (fall)
                let diff = abs(sensor.value - baselineTemp)
                deviation = min(1.0, diff / 2.0) // 2 degree change is high risk
            } else if sensor.id == "pressure" {
                // Swelling (rise)
                let diff = max(0, sensor.value - baselinePressure)
                deviation = min(1.0, diff / 10.0) // 10 mmHg increase is high risk
            } else {
                deviation = 0
            }
            
            totalRisk += deviation * sensor.weight
        }
        
        riskScore = totalRisk * 100
        
        if riskScore > 70 {
            status = "HIGH RISK: Possible Extravasation"
        } else if riskScore > 30 {
            status = "Monitoring: Subtle Changes Detected"
        } else {
            status = "Normal"
        }
    }

    func startSimulation() {
        timer = Timer.publish(every: 1.0, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                self?.updateSensors()
            }
    }

    private func updateSensors() {
        let now = Date()
        
        if !isBaselineEstablished && now.timeIntervalSince(startTime) > baselineDuration {
            isBaselineEstablished = true
            baselineTemp = sensors[0].value
            baselinePressure = sensors[1].value
        }
        
        for i in 0..<sensors.count {
            // Random walk simulation
            var variance = Double.random(in: -0.005...0.005)
            
            // Simulate a "leak" after baseline is established randomly
            if isBaselineEstablished && Double.random(in: 0...1) > 0.98 {
                // Slowly trend upwards/downwards to simulate an event
                if sensors[i].id == "temp" {
                    variance += 0.02 // Temp rise
                } else {
                    variance += 0.05 // Pressure rise
                }
            }
            
            sensors[i].value += sensors[i].value * variance
            
            // Add to history
            sensors[i].history.append(SensorValue(timestamp: now, value: sensors[i].value))
            
            // Keep only last 60 points (1 minute of data at 1Hz)
            if sensors[i].history.count > 60 {
                sensors[i].history.removeFirst()
            }
        }
        
        calculateRisk()
    }
}
