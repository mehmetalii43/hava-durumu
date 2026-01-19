function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const resultDiv = document.getElementById("weatherResult");
    resultDiv.innerHTML = "";

    if (!city) {
        resultDiv.innerText = "Lütfen bir şehir adı girin.";
        return;
    }

    // Adım 1 — Şehirden koordinat al
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&language=tr`)
        .then(response => response.json())
        .then(geoData => {
            if (!geoData.results || geoData.results.length === 0) {
                resultDiv.innerText = "Şehir bulunamadı.";
                return;
            }

            const { latitude, longitude, name } = geoData.results[0];

            // Adım 2 — Hava verilerini al
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`)
                .then(response => response.json())
                .then(weatherData => {
                    // Mevcut hava
                    const current = weatherData.current_weather;

                    resultDiv.innerHTML = `
                        <div class="day-forecast">
                            <strong>Şu An: ${name}</strong><br>
                            Sıcaklık: ${current.temperature}°C<br>
                            Kod: ${current.weathercode}
                        </div>
                        <h2>5 Günlük Tahmin</h2>
                    `;

                    // 5 günlük tahmin
                    const days = weatherData.daily.time;
                    const maxTemps = weatherData.daily.temperature_2m_max;
                    const minTemps = weatherData.daily.temperature_2m_min;
                    const codes = weatherData.daily.weathercode;

                    for (let i = 0; i < days.length; i++) {
                        resultDiv.innerHTML += `
                            <div class="day-forecast">
                                <strong>${days[i]}</strong><br>
                                Max: ${maxTemps[i]}°C<br>
                                Min: ${minTemps[i]}°C<br>
                                Kod: ${codes[i]}
                            </div>
                        `;
                    }
                })
                .catch(err => {
                    resultDiv.innerText = "Hava verisi alınamadı.";
                });
        })
        .catch(err => {
            resultDiv.innerText = "Şehir koordinatları alınamadı.";
        });
}