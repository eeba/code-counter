export function ScanningAnimation() {
  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center space-y-6">
        <div className="text-6xl animate-bounce">🔄</div>
        <div className="text-xl font-medium text-blue-400">正在统计代码...</div>
        <div className="w-48 h-2 bg-slate-700 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: "50%" }}></div>
        </div>
      </div>
    </div>
  );
}
