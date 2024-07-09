document.getElementById('submitBtn').addEventListener('click', function() {
    const gamertag = document.getElementById('gamertag').value.trim();
    const apiUrlXUID = `https://api.geysermc.org/v2/xbox/xuid/${encodeURIComponent(gamertag)}`;

    fetch(apiUrlXUID)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('XUID API Response:', data);  // Debugging log
            if (data && data.xuid) {
                const xuid = data.xuid;
                document.getElementById('result').innerHTML = `XUID: ${xuid}`;

                const apiUrlSkin = `https://api.geysermc.org/v2/skin/${xuid}`;

                return fetch(apiUrlSkin)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text();
                    })
                    .then(text => {
                        console.log('Skin API Response:', text);  // Debugging log
                        const textureIdMatch = text.match(/"texture_id":"([a-zA-Z0-9]+)"/);
                        if (textureIdMatch && textureIdMatch[1]) {
                            const textureId = textureIdMatch[1];
                            document.getElementById('result').innerHTML += `<br>Texture ID: ${textureId}`;

                            const textureUrl = `https://textures.minecraft.net/texture/${textureId}`;
                            const imgElement = document.createElement('img');
                            imgElement.src = textureUrl;
                            imgElement.alt = 'Minecraft Texture';
                            imgElement.style.width = '128px';
                            imgElement.style.height = '128px';
                            document.getElementById('result').appendChild(imgElement);

                            const downloadButton = document.createElement('a');
                            downloadButton.href = textureUrl;
                            downloadButton.download = `${gamertag}_texture.png`;
                            downloadButton.innerText = 'Download Texture';
                            downloadButton.style.display = 'block';
                            downloadButton.style.marginTop = '10px';
                            document.getElementById('result').appendChild(downloadButton);
                        } else {
                            document.getElementById('result').innerHTML += '<br>No Texture ID found.';
                        }
                    });
            } else {
                document.getElementById('result').innerText = 'No XUID found.';
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            document.getElementById('result').innerText = 'An error occurred.';
        });
});
