React = require("react")

componentA = React.createClass

	render:->
		<div id="container">
			<h1>Hello World!</h1>
		</div>

ComponentA = React.createFactory(componentA)
React.render(
	ComponentA()
	document.getElementById('main')
)