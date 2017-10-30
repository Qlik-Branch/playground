function updateFilterBar(selections) {
  $('#filters-bar').empty()
  selections.forEach(item => {
    if (item.fieldName !== 'Goal ID') {
      var filters = item.selectedValues
      filters.forEach(filter => {
        $('#filters-bar').append(
          `<span class="filter"><a href="#" onclick="unclickFilter('${item.fieldName}', '${filter.qName}')" class="delete-filter"><img class="close-icon" src="resources/images/close.png"></a><span> ${filter.qName} </span></span>`
        )
      })
    }
  })
}

function unclickFilter(filterType, filterSelection) {
  app.field(filterType).selectValues([filterSelection], true, false)
}
