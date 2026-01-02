import React, { useState } from 'react'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconCirclePlusFilled } from '@tabler/icons-react'
import { nanoid } from 'nanoid'
import { RefreshCcw } from 'lucide-react'

const TTL_OPTIONS = [
    { value: "5", label: "5 MIN" },
    { value: "10", label: "10 MIN" },
    { value: "15", label: "15 MIN" },
    { value: "20", label: "20 MIN" },
    { value: "25", label: "25 MIN" },
    { value: "30", label: "30 MIN" },
    { value: "35", label: "35 MIN" },
    { value: "40", label: "40 MIN" },
    { value: "45", label: "45 MIN" },
    { value: "50", label: "50 MIN" },
    { value: "55", label: "55 MIN" },
    { value: "60", label: "60 MIN" },
];


const CreateRoomModal = () => {
    const [roomId, setRoomId] = useState<string>("");
    const [ttl, setTTL] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    const generateRoomId = () => {
        const room = nanoid();

        setRoomId(room);
    }
    return (
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <form>
                <DialogTrigger asChild>
                    <div className='flex justify-start items-center w-full pr-20 bg-neutral-900 text-white py-1 pl-2 rounded-[10px]'>
                        <div className='w-full flex items-center justify-start gap-2'>
                            <IconCirclePlusFilled />
                            <span>Create Room</span>
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Room</DialogTitle>
                        <DialogDescription className="text-[14px] tracking-[-0.3px] font-sans">
                            Create chat - room seamlessly. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 pt-5">
                        <div className="grid gap-3">
                            <Label htmlFor="roomId-1" className='tracking-tight'>Generate RoomId</Label>
                            <div className='flex justify-center items-center gap-1'>
                                <Input className='font-mono placeholder:font-sans placeholder:text-[13px]' id="roomId-1" placeholder='Generate room-id' name="roomId" value={roomId} onChange={(e) => setRoomId(roomId)} />
                                <div onClick={generateRoomId} className='p-2 bg-[#f3f3f3] rounded-[5px] border'>
                                    <RefreshCcw size={16} className='text-neutral-800' />
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="roomId-1" className='tracking-tight'>Select Time Limit</Label>
                            <Select value={ttl} onValueChange={(v) => setTTL(v)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Time Limit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {TTL_OPTIONS.map((v, idx: number) => (
                                            <SelectItem key={idx} value={v.value}>
                                                {v.label.toLowerCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button disabled={!ttl || !roomId} type="submit">Create Room</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export default CreateRoomModal;