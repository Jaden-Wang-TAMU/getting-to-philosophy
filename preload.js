window.addEventListener('DOMContentLoaded', () => {
    const leNodeVersion = document.getElementById('node-version');
    leNodeVersion.innerText = process.versions['node'];

    document.getElementById('chrome-version').innerText = process.versions['chrome'];
    document.getElementById('electron-version').innerText = process.versions['electron'];
});
