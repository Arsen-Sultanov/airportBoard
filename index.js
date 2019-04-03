(
    function(){
        var searchInput;
        var filterButton;
        var airportBoard;

        function getData(errorFunction, successFunction){
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'data.json', true);
            xhr.send(); 
            xhr.onreadystatechange = function(){
                if(xhr.readyState !== 4) return;
                if(xhr.status !== 200){
                    errorFunction(xhr.status );
                    return;
                } else{
                successFunction(JSON.parse(xhr.responseText));
                return;
                }
            };
        };

        function setDataStorage(data){
            localStorage.setItem('data', JSON.stringify(data));
            return;
        };

        function getDataStorage(){
            return JSON.parse(localStorage.getItem('data'));
        };

        function renderTable(newTable, airportBoard){
            airportBoard.replaceChild(newTable, airportBoard.firstChild);
            return;
        };

        function serchHandler(event){
            if(event.target.value.length > 0 && event.target.value !== " "){
                renderTable(
                    createTable(
                        filter(event.target.value, "flightNumber", getDataStorage())
                    ), 
                    airportBoard
                );
                return;
            }
            renderTable(createTable(getDataStorage()), airportBoard);
            return;
        };

        function buttonsHandler(event){
            if(event.target.value === "Все рейсы"){
                renderTable(createTable(getDataStorage()), airportBoard);
                return;
            } else if(event.target.value === "Вылетающие рейсы"){
                renderTable(createTable(filter("Вылетел", "status", getDataStorage())), airportBoard);
                return;
            } else if(event.target.value === "Прилетающие рейсоы"){
                renderTable(createTable(filter("Прибыл", "status", getDataStorage())), airportBoard);
                return;
            } else if(event.target.value === "Задержанные рейсы"){
                renderTable(createTable(filter("Задержан", "status", getDataStorage())), airportBoard);
                return;
            };
            return;
        };

        function filter(filterRegExp, filterField, obj){
                var tmpObj = {};
                var regExp = new RegExp('^' + filterRegExp, 'i');
                for(var item in obj){
                    if(regExp.test(obj[item][filterField])){
                        tmpObj[item] = obj[item];
                    }
                }
                return tmpObj;
        };

        function createTable(data){
            var table = document.createElement('table');
            var tmpInerHtml = "";
            for(var item in data){
                tmpInerHtml +=
                "<tr>" 
                    + "<td>" + data[item].flightNumber + "</td>"
                    + "<td>" + data[item].direction + "</td>"
                    + "<td>" + data[item].time + "</td>"
                    + "<td>" + data[item].status + "</td>"
                + "</tr>"
            }
            table.innerHTML = tmpInerHtml;
            return table
        };

        window.onload = function(){
            searchInput = document.getElementById("searchInput");
            filterButton = document.getElementById("filterButtons");
            airportBoard = document.getElementById("airportBoard");

            searchInput.addEventListener("input", serchHandler);
            filterButton.addEventListener("click", buttonsHandler);
            
            getData(
                function(error){
                    alert(error);
                },
                function(data){
                    renderTable(createTable(data), airportBoard);
                    setDataStorage(data);
                }
            );
            
        };
    }()
);
