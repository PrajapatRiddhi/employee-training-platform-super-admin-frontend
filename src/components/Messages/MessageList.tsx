import { Card, Checkbox, Col, Input } from "antd";
import React, { useState } from "react";
import { FC } from "react";
import { dummyList } from "./dummy";
import CommonPagination from "../CommonTable/paginnation";

const MessageList: FC = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [selected, setSelected] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(10);
    const handleSearch = (e: any) => {
        setSearchText(e.target.value);
    };
    const handlePageChange = (page: React.SetStateAction<number>) => {
        setCurrentPage(page);
    };
    return (
        <>
            {" "}
            <Card className="custom-card message-card h-screen">
                <div className="message-listing">
                    <Input
                        className="search-input"
                        onChange={handleSearch}
                        placeholder="Search by subject"
                    />
                    <table className="message-list-ul">
                        {dummyList.map((item, index) => {
                            return (<tr key={index}
                                className={`message-list-li ${selected.includes(index) ? "selected" : ""
                                    }`}>
                                <td className="!pl-[25px]">
                                    <Checkbox className="custom-checkbox selection-message"   onClick={() => {
                                            if (selected.includes(index)) {
                                                setSelected(selected.filter((item) => item !== index));
                                            } else {
                                                setSelected([...selected, index]);
                                            }
                                        }}/>
                                </td>
                                <td className="from-user"> {item.name}</td>
                                <td className="message"> {item.message}</td>
                                <td className="time !pr-[25px]"> {item.time}</td>
                            </tr>)
                        })}
                    </table>

                    {/* <ul className="message-list-ul">
                        {dummyList.map((item, index) => {
                            return (
                                <Row
                                    key={index}
                                    className={`message-list-li ${selected.includes(index) ? "selected" : ""
                                        }`}
                                >
                                    <Checkbox
                                        className="custom-checkbox selection-message"
                                        onClick={() => {
                                            if (selected.includes(index)) {
                                                setSelected(selected.filter((item) => item !== index));
                                            } else {
                                                setSelected([...selected, index]);
                                            }
                                        }}
                                    />
                                    <Col span={3} className="from-user"> {item.name}</Col>
                                    <Col className="message"> {item.message}</Col>
                                    <Col className="time"> {item.time}</Col>
                                </li>
                            );
                        })}
                    </ul> */}
                </div>
            </Card>
            <CommonPagination
                className="pagination"
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={pageLimit}
                onPageChange={handlePageChange}
                onShowSizeChange={undefined}
            />
        </>
    );
};
export default MessageList;
