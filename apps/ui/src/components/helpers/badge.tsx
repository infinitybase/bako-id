import { Badge as ChakraBadge } from "@chakra-ui/react";

interface BadgeProps {
  title: string;
  color: string;
}

function Badge({ title, color }: BadgeProps) {
  return (
    <ChakraBadge
      marginRight="5rem"
      style={{
        borderRadius: "12px",
        border: `1px solid ${color}`,
        color: `${color}`,
        fontSize: "10px",
        backgroundColor: "inherit",
      }}
    >
      {title}
    </ChakraBadge>
  );
}

export const ErrorBadge = () =>
  Badge({ title: "Unavailable", color: "#F05D48" });
export const SuccessBadge = () =>
  Badge({ title: "Available", color: "#32C8D9" });
