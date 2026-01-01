"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCheckUsername, useClaimUsername } from "@/hooks/query/user";
import { CheckCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export function CreateUsername() {
    const [open, setOpen] = useState<boolean>(false);
    const { mutateAsync: claimUsernameAsync, isPending: isClaimPending } = useClaimUsername();
    const { mutateAsync: checkUsernameAsync, isPending: isCheckPending } = useCheckUsername();

    const [username, setUsername] = useState("");
    const [found, setFound] = useState<boolean | null>(null);

    const handleCheck = async () => {
        setFound(null);

        let trimmedUsername = username.trim();

        try {
            const res = await checkUsernameAsync({ username: trimmedUsername });
            setFound(res.success);
        } catch {
            setFound(false);
        }
    };

    useEffect(() => {
        if (!username) {
            setFound(null);
            return;
        }

        const timeoutId = setTimeout(() => {
            handleCheck();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [username]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (found !== true) {
            toast.error("Username is not available");
            return;
        }

        let trimmedUsername = username.trim();

        const res = await claimUsernameAsync({ username: trimmedUsername });

        setOpen(false);
        setUsername("");
        setFound(null);

        res.success ? toast.success(res.message) : toast.error(res.error);
    };

    const handleOpen = () => {
        setOpen(!open)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogTrigger asChild>
                <Button variant={"outline"}>
                    Create Username
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Claim Username</DialogTitle>
                        <DialogDescription className="text-[14px] tracking-[-0.3px] font-sans">
                            Create your unique username. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 pt-5">
                        <div className="grid gap-3 relative">
                            <Label htmlFor="username">Username</Label>

                            <Input
                                id="username"
                                name="username"
                                placeholder="type your username"
                                autoComplete="off"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            {/* STATUS ICON */}
                            <div className="absolute top-9 right-5">
                                {username && isCheckPending && <Spinner />}

                                {username && !isCheckPending && found === true && (
                                    <CheckCheck size={18} className="text-green-500" />
                                )}

                                {username && !isCheckPending && found === false && (
                                    <X size={18} className="text-red-500" />
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-5">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>

                        <Button
                            type="submit"
                            disabled={
                                isClaimPending ||
                                isCheckPending ||
                                !username ||
                                found !== true
                            }
                        >
                            {"Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
