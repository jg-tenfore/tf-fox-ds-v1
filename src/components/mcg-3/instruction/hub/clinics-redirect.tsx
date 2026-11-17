"use client";

import { useEffect } from "react";
import { McgShell } from "@/components/mcg-3/mcg-chrome";
import { clinicsHref } from "../data";
import { useInstructionNav } from "../nav";

/** `/clinics` → `/instruction?formats=clinic,junior-camp,junior-league,op36` (group programs only). */
export const ClinicsRedirect = () => {
    const { replace } = useInstructionNav();
    useEffect(() => replace(clinicsHref()), [replace]);
    return (
        <McgShell>
            <div className="min-h-[70vh]" />
        </McgShell>
    );
};
