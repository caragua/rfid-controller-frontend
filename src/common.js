export function getCookie(name){
    let value = null;

    document.cookie.split(';').forEach((item) => {
        let parts = item.trim().split('=');

        if (parts[0] == name) {
            value = parts[1].replace('%3D', '');
        }
    });

    return value;
}

        