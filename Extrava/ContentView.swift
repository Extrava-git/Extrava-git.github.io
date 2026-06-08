import SwiftUI
import Charts

struct ContentView: View {
    @StateObject private var sensorManager = SensorManager()
    @State private var selectedTab = 0
    
    var body: some View {
        HStack(spacing: 0) {
            // Sidebar
            VStack(alignment: .leading, spacing: 20) {
                SidebarButton(title: "Dashboard", icon: "waveform.path.ecg", isSelected: selectedTab == 0) {
                    selectedTab = 0
                }
                SidebarButton(title: "Hardware & Cost", icon: "cpu", isSelected: selectedTab == 1) {
                    selectedTab = 1
                }
                
                Spacer()
                
                // Device Status
                VStack(alignment: .leading, spacing: 8) {
                    Text("DEVICE STATUS")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.secondary)
                    
                    HStack {
                        Circle()
                            .fill(sensorManager.isBaselineEstablished ? Color.green : Color.orange)
                            .frame(width: 8, height: 8)
                        Text(sensorManager.isBaselineEstablished ? "BLE Connected" : "Calibrating...")
                            .font(.system(size: 12, weight: .medium))
                    }
                }
                .padding(12)
                .background(Color.secondary.opacity(0.1))
                .cornerRadius(10)
            }
            .padding(25)
            .frame(width: 220)
            .background(Color(NSColor.windowBackgroundColor))
            
            Divider()
            
            // Main Content
            ZStack {
                if selectedTab == 0 {
                    DashboardView(sensorManager: sensorManager)
                } else {
                    HardwareInfoView()
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color(NSColor.controlBackgroundColor))
        }
        .frame(minWidth: 900, minHeight: 700)
    }
}

struct SidebarButton: View {
    let title: String
    let icon: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.system(size: 16))
                Text(title)
                    .font(.system(size: 14, weight: .semibold))
            }
            .foregroundColor(isSelected ? .blue : .primary)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.vertical, 10)
            .padding(.horizontal, 12)
            .background(isSelected ? Color.blue.opacity(0.1) : Color.clear)
            .cornerRadius(8)
        }
        .buttonStyle(.plain)
    }
}

struct DashboardView: View {
    @ObservedObject var sensorManager: SensorManager
    
    var body: some View {
        ScrollView {
            VStack(spacing: 30) {
                // Risk Header
                HStack(spacing: 30) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Extravasation Risk Score")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.secondary)
                        
                        HStack(alignment: .firstTextBaseline, spacing: 4) {
                            Text("\(Int(sensorManager.riskScore))")
                                .font(.system(size: 64, weight: .black, design: .rounded))
                                .foregroundColor(riskColor(sensorManager.riskScore))
                            Text("/ 100")
                                .font(.system(size: 24, weight: .bold))
                                .foregroundColor(.secondary.opacity(0.5))
                        }
                        
                        Text(sensorManager.status)
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(riskColor(sensorManager.riskScore))
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(riskColor(sensorManager.riskScore).opacity(0.1))
                            .cornerRadius(8)
                    }
                    
                    Spacer()
                    
                    // Baseline Info
                    VStack(alignment: .trailing, spacing: 10) {
                        Text("BASELINE DATA")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.secondary)
                        
                        VStack(alignment: .trailing, spacing: 4) {
                            Text("Temp: \(String(format: "%.1f", sensorManager.baselineTemp))°C")
                            Text("Pressure: \(String(format: "%.1f", sensorManager.baselinePressure)) mmHg")
                        }
                        .font(.system(size: 14, weight: .medium, design: .monospaced))
                    }
                    .padding(20)
                    .background(Color.secondary.opacity(0.05))
                    .cornerRadius(12)
                }
                .padding(30)
                .background(Color(NSColor.windowBackgroundColor))
                .cornerRadius(16)
                
                // Live Charts
                VStack(spacing: 20) {
                    ForEach(sensorManager.sensors) { sensor in
                        VStack(alignment: .leading, spacing: 15) {
                            HStack {
                                VStack(alignment: .leading) {
                                    Text(sensor.name)
                                        .font(.system(size: 14, weight: .bold))
                                    Text("Current: \(String(format: "%.2f", sensor.value)) \(sensor.unit)")
                                        .font(.system(size: 12))
                                        .foregroundColor(.secondary)
                                }
                                Spacer()
                            }
                            
                            Chart {
                                ForEach(sensor.history) { point in
                                    LineMark(
                                        x: .value("Time", point.timestamp),
                                        y: .value("Value", point.value)
                                    )
                                    .foregroundStyle(sensor.id == "temp" ? .red : .blue)
                                    .interpolationMethod(.catmullRom)
                                    
                                    AreaMark(
                                        x: .value("Time", point.timestamp),
                                        y: .value("Value", point.value)
                                    )
                                    .foregroundStyle(
                                        LinearGradient(
                                            colors: [(sensor.id == "temp" ? Color.red : Color.blue).opacity(0.2), .clear],
                                            startPoint: .top,
                                            endPoint: .bottom
                                        )
                                    )
                                }
                            }
                            .frame(height: 150)
                            .chartYScale(domain: sensor.id == "temp" ? 34...40 : 5...25)
                            .chartXAxis(.hidden)
                        }
                        .padding(20)
                        .background(Color(NSColor.windowBackgroundColor))
                        .cornerRadius(12)
                    }
                }
            }
            .padding(30)
        }
    }
    
    private func riskColor(_ score: Double) -> Color {
        if score < 30 { return .green }
        if score < 70 { return .orange }
        return .red
    }
}

struct HardwareInfoView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 25) {
                Text("Hardware Specification & BOM")
                    .font(.system(size: 24, weight: .bold))
                
                Text("Extrava Patch utilizes a multi-modal sensor array to detect interstitial fluid accumulation.")
                    .font(.system(size: 14))
                    .foregroundColor(.secondary)
                
                VStack(spacing: 15) {
                    CostRow(item: "Microcontroller", detail: "ESP32 Dev Board (BLE + WiFi)", cost: "$8 - $12", color: .green)
                    CostRow(item: "Temperature", detail: "DS18B20 Digital Sensor", cost: "$3 - $8", color: .green)
                    CostRow(item: "Pressure/Swelling", detail: "Force Sensitive Resistor (FSR)", cost: "$5 - $10", color: .red)
                    CostRow(item: "Power System", detail: "500mAh LiPo + TP4056 Charger", cost: "$10 - $20", color: .blue)
                    CostRow(item: "Housing", detail: "Silicone Patch / Tegaderm", cost: "$5 - $15", color: .blue)
                }
                .padding(20)
                .background(Color.secondary.opacity(0.05))
                .cornerRadius(12)
                
                VStack(alignment: .leading, spacing: 10) {
                    Text("Implementation Notes")
                        .font(.system(size: 18, weight: .bold))
                    Text("• Baseline Establishment: The system monitors the first 10-15 minutes of infusion to calibrate the patient's unique thermal and pressure profile.\n• Alerts: Triggered upon rapid temperature shifts (>1.5°C) or steady pressure increase (>5mmHg).")
                        .font(.system(size: 13))
                        .foregroundColor(.secondary)
                }
            }
            .padding(40)
        }
    }
}

struct CostRow: View {
    let item: String
    let detail: String
    let cost: String
    let color: Color
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(item)
                    .font(.system(size: 14, weight: .bold))
                Text(detail)
                    .font(.system(size: 12))
                    .foregroundColor(.secondary)
            }
            Spacer()
            Text(cost)
                .font(.system(size: 14, weight: .bold, design: .monospaced))
                .padding(.horizontal, 10)
                .padding(.vertical, 4)
                .background(color.opacity(0.1))
                .foregroundColor(color)
                .cornerRadius(6)
        }
    }
}

#Preview {
    ContentView()
}
