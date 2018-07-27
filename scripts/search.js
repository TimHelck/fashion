(function() {
    var searchData;
    var designerField = $('select[name="designer"]');
    var seasonField = $('select[name="season"]');
    var eventField = $('select[name="event"]');

    var renderSelects = function(data) {
        var addOption = function(select, value, name) {
            name = name || value;
            var option = $('<option></option>');
            option.attr('value', value);
            option.text(name);
            $(select).append(option);
        };

        $.each(data['designers'], function(key, el) {
            addOption(designerField, key, el['name']);
            $.each(el['seasons'], function(k, e) {
                if (seasonField.find('[value="' + k + '"]').length === 0) {
                    addOption(seasonField, k, e);
                }
            });
        });

        $.each(data['events'], function(key, el) {
            addOption(eventField, key, el);
        });
    };

    var applySearch = function(e) {
        e.preventDefault();
        var url = 'data/pictureData.json';
        if(document.location.host.match(/localhost/)) {
            url = 'data/pictureData.json';
        }
        var query = [];
        var allSeasons = false;
        var designers = designerField.val();
        if (!!designers) {
            if (designers[0] === 'all') {
                designers = Object.keys(searchData['designers']);
            }
            var seasons = seasonField.val();
            if (seasons[0] === 'all') {
                allSeasons = true;
            }
            $.each(designers, function (k, designer) {
                $.each(searchData['designers'][designer]['seasons'], function (season) {
                    if (allSeasons || seasons.indexOf(season) !== -1) {
                        query.push(designer + '-' + season);
                    }
                })
            });
        }
        console.log(query);
        var events = eventField.val();
        if (!!events) {
            if (events[0] === 'all') {
                query = query.concat(Object.keys(searchData['events']));
            } else {
                $.each(events, function (k, e) {
                    query.push(e);
                })
            }
        }
        console.log(query);

        url += '?q=' + query.join(',');

        $.ajax({
            dataType: "text",
            url: url,
            success: function (data) {
                var obj = $.parseJSON(data);
                window.CPH.loadGalleries(obj);
            }
        });
    };

    var getSelectData = function() {
        var url = 'data/selectData.json';
        if(document.location.host.match(/localhost/)) {
            url = 'data/selectData.json';
        }
        $.ajax({
            dataType: "text",
            url: url,
            success: function (data) {
                searchData = $.parseJSON(data);
                renderSelects(searchData);
                $('form[name="search"]').on('submit', applySearch);
            }
        });
    };

    getSelectData();
})();
