import React, { useEffect, useState } from "react";
import { Table, Badge, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { Pagination } from "react-bootstrap";
import { getActivityLogs } from "../services/activityLogService";

const ActivityLogs = () => {

    const [logs, setLogs] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    const [lastPage, setLastPage] = useState(1);

    const [total, setTotal] = useState(0);


  const fetchLogs = async (page = 1) => {

    try {

        const data = await getActivityLogs({
            page,
        });

        setLogs(data.data);

        setCurrentPage(data.current_page);

        setLastPage(data.last_page);

        setTotal(data.total);

    } catch {

        toast.error("Failed to load activity logs");

    }

};

   useEffect(() => {

    fetchLogs(currentPage);

}, [currentPage]);

    const getBadge = (action) => {

        switch (action) {

            case "LOGIN":
                return "success";

            case "LOGOUT":
                return "secondary";

            case "CREATE":
                return "primary";

            case "UPDATE":
                return "warning";

            case "DELETE":
                return "danger";

            default:
                return "dark";
        }

    };

    return (

        <div className="container mt-4">

            <div className="d-flex justify-content-between mb-3">

                <h3>Activity Logs</h3>

                {/* Future */}
                {/* <Button variant="danger">Clear Logs</Button> */}

            </div>

            <Table bordered hover responsive>

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Date</th>
                        <th>User</th>
                        <th>Module</th>
                        <th>Action</th>
                        <th>Description</th>
                        <th>IP Address</th>

                    </tr>

                </thead>

                <tbody>

                    {logs.length > 0 ? (

                        logs.map((log) => (

                            <tr key={log.id}>

                                <td>{log.id}</td>

                                <td>
                                    {new Date(log.created_at)
                                        .toLocaleString()}
                                </td>

                                <td>
                                    {log.user?.name ?? "System"}
                                </td>

                                <td>
                                    {log.module}
                                </td>

                                <td>

                                    <Badge bg={getBadge(log.action)}>

                                        {log.action}

                                    </Badge>

                                </td>

                                <td>

                                    {log.description}

                                </td>

                                <td>

                                    {log.ip_address}

                                </td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td
                                colSpan="7"
                                className="text-center"
                            >

                                No activity logs found

                            </td>

                        </tr>

                    )}

                </tbody>

            </Table>
            <Pagination>

    <Pagination.Prev
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
    />

    {[...Array(lastPage)].map((_, index) => (

        <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => setCurrentPage(index + 1)}
        >

            {index + 1}

        </Pagination.Item>

    ))}

    <Pagination.Next
        disabled={currentPage === lastPage}
        onClick={() => setCurrentPage(currentPage + 1)}
    />

</Pagination>
<div className="mb-2">

    Total Logs: <strong>{total}</strong>

</div>

        </div>

    );

};

export default ActivityLogs;