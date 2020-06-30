import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {connect} from 'react-redux';
import { updateScore ,getScore } from '../actions/index'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export class Datatable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.scores,
            updateArray:[]
        }
    }
    componentWillMount(){
        this.props.getScore();
    }

    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    updateScores = () =>{
        var updateData = []
        this.state.updateArray.map((row,index) =>{
            this.state.data[row.no].weight = row.score
            this.setState({data:this.state.data})
        })
        for (let i = 0 ; i < this.state.updateArray.length ; i++){
            updateData[i] = this.state.data[this.state.updateArray[i].no];
            updateData[i].weight = this.state.updateArray[i].score
        }
        this.props.updateScore(updateData);
        toast.success("Successfully updated !")
    
        
    }
    render() {
        const { data } = this.state
        var myData = [];
        for(let i = 0 ; i < data.length; i++){
            let row;
            row = {
                No:i+1,
                question:data[i].question,
                answer:data[i].valueEn,
                score:data[i].weight    

            }
            myData.push(row);
        }   
        const renderEditable = (cellInfo) => {
            return (
                <div
                    style={{ backgroundColor: "#fafafa" }}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => {
                        console.log(cellInfo)
                        const data = {
                            no : cellInfo.index.toString(),
                            score : e.target.innerHTML
                        }
                        var flag=false;
                        // this.setState({updateArray:this.state.updateArray.push(data)})
                        var newArray = this.state.updateArray;
                        for( let i = 0 ; i < newArray.length ; i++){
                            if(newArray[i].no === data.no){
                                newArray[i].score = data.score
                                flag = true
                            }

                        }
                        if(flag === false){
                            newArray.push(data)
                        }
                        
                        this.setState({updateArray:newArray})
                        console.log(this.state.updateArray)
                        
                        // const data = [...this.state.myData];
                        // myData[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                        // this.setState({ myData: data });
                    }}
                    dangerouslySetInnerHTML={{
                        __html: myData[cellInfo.index][cellInfo.column.id]
                    }}
                />
            );
        }
        const columns = [];
        for (var key in myData[0]) {

            let editable = renderEditable
            let width = 200
            let visible = {
                textAlign: 'center'
            }
            if(key === "No"){
                editable = null
            }
            if(key === "question"){
                editable = null
                width= 600
            }
            if(key === "answer"){
                editable = null
                width= 600
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
        columns.push(
            {
                Header: <button className="btn btn-primary btn-sm btn-delete mb-0 b-r-4"
                    onClick={
                        (e) => {                            
                                this.updateScores()
                        }}>Update</button>,
                id: 'update',
                accessor: str => "update",
                sortable: false,
                style: {
                    textAlign: 'center'
                },
                Cell: (row) => (
                    <div>
                        <span >
                        </span>
                    </div>
                ),
                accessor: key,
                style: {
                    textAlign: 'center'
                }
            }
        )

        return (
            <Fragment>
                <ReactTable
                    data={myData}
                    columns={columns}
                    defaultPageSize={20}
                    className={'-striped -highlight'}
                    showPagination={true}
                />
                <ToastContainer />
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    scores: state.auth.scores,

})

export default connect(
    mapStateToProps,{updateScore,getScore}
)(Datatable)