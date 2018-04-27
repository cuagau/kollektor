data = function () {
  var data = {medias: {}, tags: {}, categories: {}, flags: []};

  this.addMedia = function (hash, location) {
    data.medias[hash] = {location: location, tags: {}};
  }

  this.addFlag = function(hash, flag) {
    if (!data.medias[hash]) {
      return;
    }
    if (!data.tags[tag]) {
      data.tags[tag] = [];
    }
    data.tags[tag].push(hash);

    data.medias[hash].tags[tag] = true;
  }

  this.addCategory = function (hash, category, value) {
    if (!data.medias[hash]) {
      return;
    }
    if (!data.tags[value]) {
      data.tags[value] = [];
    }
    data.tags[value].push(hash);

    data.medias[hash].tags[category] = value;
  }

  this.get = function () {
    return data;
  }
  return this;
}();

exports.data = data;