import React, {useState} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import {create} from './api-user.js'
import {Link} from 'react-router-dom'
import CreateGroupForm from './CreateGroupForm'
import CreateLocalGroupForm from './CreateLocalGroupForm'

import GroupsList from './GroupsList'
import auth from './../auth/auth-helper'



export default function GroupsPage (){

  const useStyles = makeStyles(theme => ({
    card: {
      maxWidth: 600,
      margin: 'auto',
      textAlign: 'center',
      marginTop: theme.spacing(5),
      paddingBottom: theme.spacing(2)
    },
    error: {
      verticalAlign: 'middle'
    },
    title: {
      marginTop: theme.spacing(2),
      color: theme.palette.openTitle
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 300
    },
    submit: {
      margin: 'auto',
      marginBottom: theme.spacing(2)
    }
  }))
  const classes = useStyles()
  const [viewForm, setViewForm]=useState(false)
  const [viewGroupList, setViewGroupList]=useState(false)



    return (<div>
      <Card className={classes.card}>
      <br/>
      <br/>
        <CardContent>
        <button className={classes.submit} onClick={()=>{setViewForm(!viewForm)}}>Create Group?</button>
        {viewForm && <CreateGroupForm />}
        {viewForm && <CreateLocalGroupForm />}
        <button className={classes.submit} id="viewgrouplist" onClick={()=>{setViewGroupList(!viewGroupList)}}>View Group List?</button>

        {viewGroupList&&<GroupsList />}
          </CardContent>
        </Card>


    </div>)
}
