<div class="layer">
	<img src="${require('../../assets/137.png')}">
	<div>this is  <%= name %>layer</div>
	<% for(var i=0;i<arr.length;i++){%>
	<%= arr[i] %>
	<%}%>
</div>