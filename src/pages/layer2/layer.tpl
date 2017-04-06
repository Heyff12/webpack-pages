<div class="layer">
	<img src="${require('../../assets/star.png')}">
	<div>this is  <%= name %>layer</div>
	<% for(var i=0;i<arr.length;i++){%>
	<%= arr[i] %>
	<%}%>
</div>