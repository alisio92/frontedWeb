
import java.awt.EventQueue;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.UIManager;
import javax.swing.border.EmptyBorder;

public class Login extends JFrame {

    private static final long serialVersionUID = 1L;
    private JPanel contentPane;
    private JTextField txtName;
    private final JTextField txtAddress;
    private final JLabel lblIpAddress;
    private final JTextField txtPort;
    private final JLabel lblPort;
    private final JLabel lblAddressDesc;
    private final JLabel lblPortDesc;

    public Login() {
        initComponents();
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e1) {
            e1.printStackTrace();
        }
        setResizable(false);
        setTitle("Login");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(300, 380);
        setLocationRelativeTo(null);
        contentPane = new JPanel();
        contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
        setContentPane(contentPane);
        contentPane.setLayout(null);

        txtName = new JTextField();
        txtName.setBounds(67, 50, 165, 28);
        contentPane.add(txtName);
        txtName.setColumns(10);

        JLabel lblName = new JLabel("Name:");
        lblName.setBounds(127, 34, 45, 16);
        contentPane.add(lblName);

        txtAddress = new JTextField();
        txtAddress.setBounds(67, 116, 165, 28);
        contentPane.add(txtAddress);
        txtAddress.setColumns(10);

        lblIpAddress = new JLabel("IP Address:");
        lblIpAddress.setBounds(111, 96, 77, 16);
        contentPane.add(lblIpAddress);

        txtPort = new JTextField();
        txtPort.setColumns(10);
        txtPort.setBounds(67, 191, 165, 28);
        contentPane.add(txtPort);

        lblPort = new JLabel("Port:");
        lblPort.setBounds(133, 171, 34, 16);
        contentPane.add(lblPort);

        lblAddressDesc = new JLabel("(eg. 192.168.0.2)");
        lblAddressDesc.setBounds(94, 142, 112, 16);
        contentPane.add(lblAddressDesc);

        lblPortDesc = new JLabel("(eg. 8192)");
        lblPortDesc.setBounds(116, 218, 68, 16);
        contentPane.add(lblPortDesc);

        JButton btnLogin = new JButton("Login");
        btnLogin.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                String name = txtName.getText();
                String address = txtAddress.getText();
                int port = Integer.parseInt(txtPort.getText());
                login(name, address, port);
            }
        });
        btnLogin.setBounds(91, 311, 117, 29);
        contentPane.add(btnLogin);
    }

    private void login(String name, String address, int port) {
        dispose();
        new ClientWindow(name, address, port);
    }

    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 400, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 300, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    public static void main(String[] args) {
        EventQueue.invokeLater(new Runnable() {
            public void run() {
                try {
                    Login frame = new Login();
                    frame.setVisible(true);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }
    // Variables declaration - do not modify//GEN-BEGIN:variables
    // End of variables declaration//GEN-END:variables
}
