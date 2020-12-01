var chart;
var table;
var dataTable;


var reloadGraph = function (projects) {
    chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        zoomEnabled: true,
        zoomType: "x",
        theme: "light2",
        title:{
            text: "Projects",
            fontFamily: "arial black",
            fontColor: "#695A42"
        },
        height: 550,
        width: 1050,
        axisX: {
            title:"Delay",
            interval: 1,
            labelAutoFit: false
        },
        axisY:{
            title: "Money At Risk",
            minimum: 0,
            suffix: "%"
        },
        legend: {
            cursor: "pointer",
            itemclick: function (e) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                e.chart.render();
            }
        },
        data: projects.map(project => {
            let splittedOperationDeadlineDate = project.operationDeadline.split('/').map(x=> parseInt(x))
            let operationDeadlineDate = new Date(splittedOperationDeadlineDate[2], splittedOperationDeadlineDate[1]-1, splittedOperationDeadlineDate[0])
            let splittedUpdatedOerationDeadlineDate = project.updatedOerationDeadline.split('/').map(x=> parseInt(x))
            let updatedOerationDeadlineDate = new Date(splittedUpdatedOerationDeadlineDate[2], splittedUpdatedOerationDeadlineDate[1]-1, splittedUpdatedOerationDeadlineDate[0])
            let diffInDays = Math.abs(operationDeadlineDate.getTime() - updatedOerationDeadlineDate.getTime()) / (1000 * 3600 * 24)
            let label = 'NoDelay'
            let value = 0
            if (diffInDays <= 30 && diffInDays > 0){
                label = 'UntilMonth'
                value = 1
            }
            if (diffInDays > 30){
                label = 'MoreThanMonth'
                value = 2
            }
            return {
            type: "bubble",
            showInLegend: true,
            fillOpacity: .5,
            cursor: "pointer",
            bevelEnabled: true,
            click: onClick,
            name: project.projectName,
            color: parseInt(project.isDigital) === 1 ? 'blue': 'green',
            toolTipContent: "<b>{name}</b><br/>Operation Deadline: {operationDeadline} <br/>Updated Oeration Deadline: {updatedOerationDeadline} <br/>Delay: {delayInDays} <br/> Money At Risk: {y}% <br/> Description: {description} <br/> Budget(nis): {nis}<br/> Budget(dollar): {dollar}",
            dataPoints: [{
                y: (parseInt(project.nisBudgetAtRisk) / parseInt(project.totalBudgetNis)) * 100,
                z: parseInt(project.totalBudgetNis) + parseInt(project.totalBudgetDollar),
                nis: parseInt(project.totalBudgetNis),
                dollar: parseInt(project.totalBudgetDollar),
                name: project.projectName,
                description: project.projectDescription,
                color: parseInt(project.isDigital) === 1 ? 'blue': 'green',
                operationDeadline: project.operationDeadline,
                updatedOerationDeadline: project.updatedOerationDeadline,
                delayInDays: diffInDays,
                x: value,
                label: label
            }]
        }})
    });
    chart.render();
}

var onClick = function (e) {
    alert(e.dataSeries.name)
}

var reloadTable = function (projects) {
    table = $('#projectsTable')
    let blacklist = ["_id"]
    let tableStr = '<thead><tr>'
    for(let key in projects[0]){
        if( blacklist.indexOf(key) === -1) {
            tableStr += `<th>${key}</th>`
        }
    }
    tableStr +='</tr></thead><tbody>'
    for(let project of projects){
        tableStr += `<tr>`
        for(let key in project){
            if( blacklist.indexOf(key) === -1) {
                tableStr += `<td>${project[key]}</td>`
            }
        }
        tableStr += '</tr>'
    }
    tableStr += '</tbody>'
    table.append(tableStr)

    dataTable = table.DataTable({
        "paging":   true,
        "ordering": true,
        "info":     true,
        "searching": true
    });
}

var cleanComponents = function () {
    if(chart) {
        chart.destroy();
        chart = null;
    }
    if(table){
        dataTable.destroy()
        dataTable = null
        table.empty()
        table = null
    }
}

var displayProjectsInGraph = function () {
    cleanComponents()
    $.get(`${getConfig().budgetHost}/projects`, function(data, status){
        if(status === 'success') {
            reloadGraph(data)
        }
        else{
            alert(`error occured, status code: ${status}`)
        }
    });
}

var displayProjectsInTable = function () {
    cleanComponents()
    $.get(`${getConfig().budgetHost}/projects`, function(data, status){
        if(status === 'success') {
            reloadTable(data)
        }
        else{
            alert(`error occured, status code: ${status}`)
        }
    });
}