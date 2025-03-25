import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listMessages } from "../../../graphql/queries"; // Adjust path if needed
import "./index.css";
import Header from "../../../components/adminHeader";

const messages = [
    { 
      id: 1, 
      mail: "alice@example.com", 
      name: "Alice Johnson", 
      message: "Hello! I'm interested in your services.", 
      numero: "+1234567890" 
    },
    { 
      id: 2, 
      mail: "bob.smith@example.com", 
      name: "Bob Smith", 
      message: "Can you send me more details?", 
      numero: "+1987654321" 
    },
    { 
      id: 3, 
      mail: "charlie.doe@example.com", 
      name: "Charlie Doe", 
      message: "Thanks for the quick response!", 
      numero: "+1122334455" 
    },
    { 
      id: 4, 
      mail: "diana.ross@example.com", 
      name: "Diana Ross", 
      message: "When is the next meeting?", 
      numero: "+1098765432" 
    },
    { 
      id: 5, 
      mail: "emma.watson@example.com", 
      name: "Emma Watson", 
      message: "I really appreciate your help.", 
      numero: "+1029384756" 
    },
    { 
      id: 6, 
      mail: "frank.castle@example.com", 
      name: "Frank Castle", 
      message: "Let's schedule a call tomorrow.", 
      numero: "+1472583690" 
    },
    { 
      id: 7, 
      mail: "george.miller@example.com", 
      name: "George Miller", 
      message: "Please review the document I sent.", 
      numero: "+1654321098" 
    },
    { 
      id: 8, 
      mail: "hannah.brown@example.com", 
      name: "Hannah Brown", 
      message: "Is there an update on my request?", 
      numero: "+1765432109" 
    },
    { 
      id: 9, 
      mail: "ian.fleming@example.com", 
      name: "Ian Fleming", 
      message: "Looking forward to our collaboration!", 
      numero: "+1346798520" 
    },
    { 
      id: 10, 
      mail: "jessica.jones@example.com", 
      name: "Jessica Jones", 
      message: "Could you clarify the pricing details?", 
      numero: "+1987456123" 
    }
  ];
  
  

const MessagesPage = () => {
  const [search, setSearch] = useState("");
 
  
  // Mock Messages Data (Replace with API data)
 

  // Fetch messages from GraphQL
/**
 *   useEffect(() => {
    const fetchMessages = async () => {
      try {
        const result = await API.graphql(graphqlOperation(listMessages));
        setMessages(result.data.listMessages.items);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);
 */

  // Filter messages based on search query
  const filteredMessages = messages.filter((msg) =>
    msg.name?.toLowerCase().includes(search.toLowerCase()) ||
    msg.message?.toLowerCase().includes(search.toLowerCase()) ||
    msg.mail?.toLowerCase().includes(search.toLowerCase()) ||
    msg.numero?.includes(search)
  );

  return (
    <div className="message-main">
      {/* Full-width Header */}
      <Header />

      {/* Messages Section */}
      <div className="messages-container">
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Messages List */}
        <div className="messages-list">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div key={msg.id} className="message-item">
                <div className="message-info">
                  <h4>{msg.name || "Unknown"}</h4>
                  <p>{msg.message}</p>
                  <small>Email: {msg.mail || "N/A"}</small> |{" "}
                  <small>Phone: {msg.numero || "N/A"}</small>
                </div>
              </div>
            ))
          ) : (
            <p className="no-messages">No messages found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
