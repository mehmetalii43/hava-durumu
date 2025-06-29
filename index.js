const apiKey = "6d6fa693fd67581b9fb1dbbb4bf4b15b";

const backgroundMap = {
    Clear: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80",
    Rain: "https://images.unsplash.com/photo-1527766833261-b09c3163a791?auto=format&fit=crop&w=1350&q=80",
    Snow: "https://images.unsplash.com/photo-1602810316286-b2d13f9aa92e?auto=format&fit=crop&w=1350&q=80",
    Clouds: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1350&q=80",
    Thunderstorm: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1350&q=80",
    Drizzle: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1350&q=80",
    Mist: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1350&q=80",
};

function getBackgroundImage(mainWeather) {
    return backgroundMap[mainWeather] || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1350&q=80";
}

function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const resultDiv = document.getElementById("weatherResult");
    resultDiv.innerHTML = "";
    if (!city) {
        resultDiv.innerText = "Lütfen bir şehir adı girin.";
        return;
    }

    // Ana hava durumu için (güncel)
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=tr`)
        .then(response => {
            if (!response.ok) throw new Error("Şehir bulunamadı.");
            return response.json();
        })
        .then(data => {
            document.body.style.backgroundImage = `url('${getBackgroundImage(data.weather[0].main)}')`;

            resultDiv.innerHTML = `
        <div class="day-forecast">
          <strong>Şu An: ${data.name}</strong>
          Sıcaklık: ${data.main.temp}°C<br>
          Hava: ${data.weather[0].description}
        </div>
      `;
        })
        .catch(err => {
            resultDiv.innerText = "Hata: " + err.message;
        });

    // 5 günlük tahmin için
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=tr`)
        .then(response => {
            if (!response.ok) throw new Error("Tahmin verileri alınamadı.");
            return response.json();
        })
        .then(data => {
            // 5 günlük tahmini saat 12:00 için filtrele
            const forecastByDay = {};
            data.list.forEach(item => {
                if (item.dt_txt.includes("12:00:00")) {
                    const date = new Date(item.dt * 1000);
                    const dayName = date.toLocaleDateString("tr-TR", { weekday: "long" });
                    forecastByDay[dayName] = item;
                }
            });

            // Günlük tahminleri ekrana yazdır
            let forecastHtml = "<h2>5 Günlük Tahmin</h2>";
            for (const [day, weather] of Object.entries(forecastByDay)) {
                forecastHtml += `
          <div class="day-forecast">
            <strong>${day}</strong>
            Sıcaklık: ${weather.main.temp}°C<br>
            Hava: ${weather.weather[0].description}
          </div>
        `;
            }
            resultDiv.innerHTML += forecastHtml;
        })
        .catch(err => {
            resultDiv.innerHTML += "<br>5 günlük tahmin alınamadı.";
        });
}
