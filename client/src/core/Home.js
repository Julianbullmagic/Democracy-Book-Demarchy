import React, {useState, useEffect} from 'react'
import ChatPage from "./../ChatPage/ChatPage"
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import unicornbikeImg from './../assets/images/unicornbike.jpg'
import Grid from '@material-ui/core/Grid'
import auth from './../auth/auth-helper'
import FindPeople from './../user/FindPeople'
import Newsfeed from './../post/Newsfeed'
const KmeansLib = require('kmeans-same-size');



export default function Home({history}){
  const [defaultPage, setDefaultPage] = useState(false)


  useEffect(()=> {
    setDefaultPage(auth.isAuthenticated())
    const unlisten = history.listen (() => {
      setDefaultPage(auth.isAuthenticated())
    })
    return () => {
      unlisten()
    }
  }, [])

    return (
      <>

        { !defaultPage &&
          <Grid container spacing={8}>

            <Grid item xs={12}>
              <Card className="card">
                <Typography variant="h6" className="title">
                  The strong take what they can while the weak suffer what they must?
                  &^%# no, try Democracy Book instead.
                </Typography>
                <CardMedia className="media" image={unicornbikeImg} title="Unicorn Bicycle"/>
                <Typography variant="body2" component="p" className="credit" color="textSecondary">Photo by <a href="https://unsplash.com/@boudewijn_huysmans" target="_blank" rel="noopener noreferrer">Boudewijn Huysmans</a> on Unsplash</Typography>
                <CardContent>
                  <Typography type="body1" component="p">
                    Welcome

                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        }
        {defaultPage &&
          <>
          <Grid container spacing={8}>



            <Grid item xs={8} sm={7}>
              <Newsfeed/>
            </Grid>
          
          </Grid>
          <ChatPage/>
          </>
        }
      </>
    )
}
