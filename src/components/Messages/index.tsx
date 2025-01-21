import { FC, useEffect, useState } from "react";
import MessageList from "./MessageList";
import { Button, Card } from "antd";
import PlusIconWhite from "../Icons/PlusIconWhite";
import MessageMailIcon from "../Icons/MessageMailIcon";
import SendMessageIcon from "../Icons/SendMessageIcon";
import DraftMessageIcon from "../Icons/DraftMessageIcon";
import { useRouter } from "next/router";
import { lowercase } from "@/src/helper/Utils";

const Message: FC = () => {
    const router = useRouter();

    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [selected, setSelected] = useState<number | null>(0);
    console.log('hoverIndex :>> ', hoverIndex);
    useEffect(() => {
        const hash = window.location.hash;
        if (hash === '#send') {
            setSelected(1);
        } else if (hash === '#draft') {
            setSelected(2);
        } else {
            setSelected(0); // Default to inbox
        }
    }, []);
    const handleItemClick = (index: number, label: string) => {
        setSelected(index);
        const path = `/users/messages?#${label}`;
        router.push(path);
    };
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-[20px]">
                <div className="heading-title">Messages</div>
            </div>
            <div className="flex gap-[20px]">
                <Card className="custom-card max-w-[286px] w-full flex-col h-screen">
                    <Button
                        type="primary"
                        className="custom-heading-btn flex items-center gap-[5px] !h-[40px] w-full"
                        onClick={() => { }}
                    >
                        <PlusIconWhite /> Create New Message
                    </Button>
                    <ul className="message-sidebar">
                        {[ 
                            { icon: <MessageMailIcon isHovered={hoverIndex===0}/>, label: "Inbox", count: 1 }, 
                            { icon: <SendMessageIcon isHovered={hoverIndex == 1 } />, label: "Sent", count: 1 }, 
                            { icon: <DraftMessageIcon isHovered={hoverIndex == 2 }/>, label: "Draft", count: 1 } 
                        ].map((item, index) => (
                            <li
                                key={index}
                                onMouseEnter={() => setHoverIndex(index)}
                                onMouseLeave={() => setHoverIndex(null)}
                                className={selected === index ? 'selected' : ''}
                                onClick={() => handleItemClick(index, lowercase(item.label))}
                            >
                                <div>
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>
                                <span className="text-secondary">{item.count}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
                <div className="w-full">
                    <MessageList />
                </div>
            </div>
        </div>
    );
};

export default Message;
