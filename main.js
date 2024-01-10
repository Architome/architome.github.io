window.addEventListener("load", (event) => {
    const cid = window.location.pathname.split('/').pop();
    (async function (cid) {
        let response;
        try {
            response = await fetch('https://cloudflare-ipfs.com/ipfs/' + cid);
        } catch (e) {
            document.body.innerHTML = 'Failed to load CID: ' + cid;
        }

        const buffer = await response.arrayBuffer();

        let data;
        try {
            data = Brotli.decompress(new Uint8Array(buffer));
        } catch (e) {
            document.body.innerHTML = 'Failed to decompress data with Brotli: ' + e.message;
        }

        const json = new TextDecoder().decode(data);

        let thread, posts;
        try {
            [ thread, posts ] = JSON.parse(json);
        } catch (e) {
            document.body.innerHTML = 'Failed to parse data as JSON: ' + e.message;
        }

        document.title = '/' + thread.board + '/' + (thread.title !== undefined ? ' - ' + thread.title : '');
        document.body.appendChild(generateDOM(thread, posts));
    })(cid); 
});
