React = require ("react")
Button = require ("react-bootstrap")
{State,Link,Navigation} = require('react-router')


overLay = React.createClass

	getInitialState:->
		team = ''

	render:->
		<div className="overlay-main">
			<h2 className="main-header"> Choose A Team! </h2>
			<div className="buttons">
				<Button type="button" className="mybtn btn btn-danger btn-block">Red Team</Button>

				<Button type="button" className="mybtn btn btn-grey btn-block">Grey Team</Button>
			</div>
		</div>

ComponentA = React.createFactory(overLay)
React.render(
	ComponentA()
	document.getElementById('main')
)











