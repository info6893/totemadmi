import { Ticket } from "@/components/admitotem/Ticket";

export default function TicketPrint({
    params,
  }:{
    params: { Cuenta: string }
  }) {

    return (
        <>
            <Ticket Cuenta={params.Cuenta} />
        </>
    );
}