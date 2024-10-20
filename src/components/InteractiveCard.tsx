import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { CardMessage } from "@/interfaces/types";

export default function InteractiveCard({
  message,
  isOpen,
}: {
  message: CardMessage;
  isOpen: boolean;
}) {
  return (
    <Drawer open={isOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{message?.question ?? "Question"}</DrawerTitle>

          {message?.answers?.map((answer) => (
            <div key={answer.answer}>{answer.answer}</div>
          ))}
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
