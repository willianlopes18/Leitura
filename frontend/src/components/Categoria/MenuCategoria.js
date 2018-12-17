import React, { Component } from 'react'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Link } from 'react-router-dom'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Collapse from '@material-ui/core/Collapse'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

 const styles = theme => ({
    nested: {
      paddingLeft: theme.spacing.unit * 4,
    }
  })

class MenuCategoria extends Component{

  state = {
    expandirCategorias: false
  }

  handleClick = () => this.setState(
    {expandirCategorias: !this.state.expandirCategorias}
  )

  render (){

    const { categorias, classes } = this.props
    const { expandirCategorias } = this.state

    return (
      <MenuList component="nav">
        <MenuItem component={Link} to="/home" key="home">
            <ListItemText inset primary="Home"/>
        </MenuItem>
        <MenuItem onClick={this.handleClick}>
            <ListItemText inset primary="Categorias" />
            {expandirCategorias ? <ExpandLess /> : <ExpandMore />}
        </MenuItem>
        <Collapse in={expandirCategorias} timeout="auto" unmountOnExit>
          <MenuList component="div" disablePadding>
            {categorias && categorias.map(c =>
              <MenuItem component={Link} to={`/${c.name}`} key={c.name} className={classes.nested}>
                <ListItemText inset primary={c.name}/>
              </MenuItem>)}
          </MenuList>
        </Collapse>
      </MenuList>
    )
  }
}

MenuCategoria.propTypes = {
	categorias: PropTypes.array.isRequired
}

export default withStyles(styles)(MenuCategoria)