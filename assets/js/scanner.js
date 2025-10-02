// scanner.js
let html5QrCode;
let isScanning = false;
const qrCodeRegionId = "qr-reader";

function startQRScanner(onScanSuccess, onScanFailure) {
  if (isScanning) return;
  isScanning = true;

  html5QrCode = new Html5Qrcode(qrCodeRegionId);
  const config = { fps: 10, qrbox: { width: 250, height: 250 } };

  html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure)
    .catch(err => {
      console.error("Unable to start scanning", err);
      alert("Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.");
      isScanning = false;
      $('#scannerModal').modal('hide');
    });
}

function stopQRScanner() {
  if (html5QrCode && isScanning) {
    html5QrCode.stop().then(() => {
      isScanning = false;
    }).catch(err => {
      console.error("Unable to stop scanning", err);
      isScanning = false;
    });
  }
}
