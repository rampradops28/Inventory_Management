import { useState } from "react";
import BooksTable from "./BooksTable";
import AddBookModal from "./AddBookModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function BooksTab() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddBook = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen">
      <BooksTable />

      <Button
        onClick={handleAddBook}
        variant="default"
        size="lg"
        className="fixed bottom-10 right-10 "
      >
        <Plus className="w-5 h-5" />
        <span>Add Book</span>
      </Button>

      {isModalOpen && <AddBookModal onClose={handleCloseModal} />}
    </div>
  );
}

export default BooksTab;
