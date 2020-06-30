import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { BASIC_URL } from '../config/config';
import { CSVLink, CSVDownload } from "react-csv";


export class Datatable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data
        }
    }
    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    render() {
        const { data } = this.state
        for(var i = 0; i < data.length; i++) {
            delete data[i]['asset'];
            delete data[i]['houseMembersList'];
            delete data[i]['diseaseMembersList'];
            delete data[i]['end'];
            delete data[i]['__v'];
            delete data[i]['_id'];
            delete data[i]['symptomsType']
        }
        console.log(data)
        const columns = [];
        for (var key in data[0]) {

            let editable = null
            let width = 200
            let visible = {
                textAlign: 'center'
            }

            columns.push(
                {
                    Header: <b>{this.Capitalize(key.toString())}</b>,
                    accessor: key,
                    Cell: editable,
                    style: visible,
                    width:width
                });
        }
        console.log(columns)


        return (
            <Fragment>
                <CSVLink data={this.props.CSVData} style={{marginLeft:"30px",marginBottom:"10px",padding:"10px",border:"1px solid blue",color:"blue"}}>Download EXCEL</CSVLink>
                <div style={{marginTop:"20px"}}>
                    <ReactTable
                        data={data}
                        columns={columns}
                        defaultPageSize={10}
                        className={'-striped -highlight'}
                        showPagination={true}
                    />
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    data: state.auth.data,
    CSVData:state.auth.CSV

})

export default connect(
    mapStateToProps,{}
)(Datatable)