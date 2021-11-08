import React from 'react'
import {Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({ title, cases, total, isRed, active,  ...props }) { //props i.e total..
    return (
        <Card 
        onClick={props.onClick}
        className={ "infoBox ${active && 'infoBox--selected'} ${ isRed && 'infoBox--red'}"}
        >
            <CardContent>
                {/* Title i.e Coronavirus cases */}
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>

                {/* 120K Number of cases */}
                <h2 className="infoBox__cases">{cases}</h2>
                
                {/* 1.2MTotal */}
                <Typography className="infoBox__total" color="textSecondary">
                    {total}Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
