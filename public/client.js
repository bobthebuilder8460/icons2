function search() {
  let searchTerm = document.getElementById("myInput").value;
  let uri = "https://kitsu.io/api/edge/anime?filter[text]=" + searchTerm;

  fetch(uri, fetchData)
    .then(resp => resp.json()) // Transform the data into json
    .then(function(data) {
      getImageData(data);
      /*document.getElementById("content").innerHTML += "<h1>Kitsu General Search</h1>" + JSON.stringify(data, undefined, 2) + "<br><br>";*/
    })

    .catch(function(error) {
      document.getElementById("content").innerHTML +=
        "Error with Kitsu API: " + error;
    });
}

function getForecastFromCache(coords){
if (!('caches' in window)) {
  return null;
}
const url = `${window.location.origin}/forecast/${coords}`;
return caches.match(url)
    .then((response) => {
      if (response) {
        return response.json();
      }
      return null;
    })
    .catch((err) => {
      console.error('Error getting data from cache', err);
      return null;
    });
} //get forecastFromCache

//  Kitsu General Search
const url_fd = "https://kitsu.io/api/edge/anime?filter[text]=naruto";
let fetchData = {
  headers: {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json"
  }
};

fetch(url_fd, fetchData)
  .then(resp => resp.json()) // Transform the data into json
  .then(function(data) {
    getImageData(data);
    //document.getElementById("content").innerHTML += "<h1>Kitsu General Search</h1>" + JSON.stringify(data, undefined, 2) + "<br><br>";
  })

  .catch(function(error) {
    document.getElementById("content").innerHTML +=
      "Error with Kitsu API: " + error;
  });

function getImageData(data) {
  var output = "";
  for (var i = 0; i < data.data.length; i++) {
    output += "<div class='card'>";
    output += "<h1>";
    var str = data.data[i].attributes.titles.en_jp;
    console.log(i + " value is " + str);
    if (str == undefined) {
      output += data.data[i].attributes.canonicalTitle;
    } else {
      output += str;
    }
    output += "</h1>";
    output += "<h3>" + data.data[i].attributes.ageRating + "</h3>";
    output += "<h3>" + data.data[i].attributes.ageRatingGuide + "</h3>";
    output += "<img class='img' src ='" +
    data.data[i].attributes.posterImage.small + "' alt=''><br>";
    output +="<p class='synopsis'>" + data.data[i].attributes.synopsis + "</p>";
    output += "</div>";
  }
  document.getElementById("content").innerHTML = output;
}

var input = document.getElementById("myInput");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("myBtn").click();
  }
});
